import Student from "../models/student.js";

// export function getStudents(req, res){
// 	//read and get all the students information from the mongoDB database
    
// 	Student.find()
// 		.then((data) => {
// 			console.log(data);
// 			res.json(data);
// 		})
// 		.catch(() => {});
// }
export async function getStudents(req, res){
	//read and get all the students information from the mongoDB database
    try{
		const students = await Student.find();
		res.json(students);
	}catch(err){
		console.error(err);
		res.status(500).json({
			message: "Failed to retrieve students"
		});
	}
}


export function createStudent(req, res){

    if(req.user==null){
        res.status(404).json({
			message: "login again to get token"
		})
		return
	}
	
	if(req.user.role!="admin"){
		res.status(403).json({
			message: "only admin can create student"
		})
		return

	}


	console.log("Post request received")
	const student = new Student({
		name: req.body.name,
		age: req.body.age,
		city: req.body.city,
	});

	student
		.save()
		.then(() => {
			res.json({
				message: "Student created successfully",
			});
		})
		.catch(() => {
			res.json({
				message: "Failed to create student",
			});
		});
}