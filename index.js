import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

app.use(bodyParser()) //gjfchgjf

//error handler
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = {error: err.message}
    }
})

//test purpose
app.use(async (ctx, next) => {
    const date = new Date()
    console.log(`You are fetching through ${ctx.method} HTTP method, Your URL now is ${ctx.url} and Date/Time is ${date.toString()}`)
    await next()
})

const students = []; //global

router.get('/students', ctx => {
    ctx.body = students.length == 0 ? {data: [] , message : 'Student not found!'} : {data:students}
})

router.post('/students', ctx => {
    const { name, rollNo, marks, gender } = ctx.request.body
    if (!name || !rollNo || !marks || !gender) {
        ctx.status = 400
        ctx.body = "All Field Required"
        return
    }

    if (marks < 0 || marks > 100) {
        ctx.status = 400
        ctx.body = { message: "Marks should be between 0-100" }
        return
    }
    
    const newStudent = { id: students.length + 1, name, rollNo, marks, gender }
    students.push(newStudent)
    ctx.status = 201
    ctx.body = newStudent
})

router.put('/students/:id', ctx => {
    const { id } = ctx.params
    const { name, rollNo, marks, gender } = ctx.request.body

    const student = students.find(s => s.id == id)

    if (!student) {
        ctx.status = 404
        ctx.body = { message: "student not found" }
        return
    }
    
    if (!name || !rollNo || !marks || !gender) {
        ctx.status = 400
        ctx.body = "All Field Required"
        return
    }

    if (marks < 0 || marks > 100) {
        ctx.status = 400
        ctx.body = { message: "Marks should be between 0-100" }
        return
    }
    
    student.name = name
    student.rollNo = rollNo
    student.marks = marks
    student.gender = gender

    ctx.status = 201
    ctx.body = student
})

router.delete("/students/:id", ctx => {
    const { id } = ctx.params
    const index = students.findIndex(s => s.id == id)
    console.log(index)

    if (index === -1) {
        ctx.status = 404
        ctx.body = { message: "Student not found" }
        return
    }
    
    const removedStudent = students.splice(index, 1)
console.log(removedStudent)
    ctx.status = 200
    ctx.body = { message: `Student Deleted with id ${id}` };
})


app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, ()=>console.log("server running at port 3000"))