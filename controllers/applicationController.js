
import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required",
                success: false
            });
        };
        //check if the use has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "you have already applied for this jog",
                success: false
            });
        }
        //check if the jobs exists   
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        //create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "job appliyed successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        })
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "success",
            application,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//admin dekhega kitane usre applay kia hei.

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
         const job = await Job.findById(jobId).populate({
            path:'applications',              //nestade poulate
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
         });
         if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false
            })
         }

         return res.status(200).json({
            job,
            success:true
         })
    } catch (error) {
        console.log(error)
    }
}

export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const applicationsId = req.params.id;
        if(!status){
            return res.status(404).json({
                message:"status is reqired",
                success:false
            })
        };
//find application by application id
        const application = await Application.findOne({_id:applicationsId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };
        //update the status
        application.status = status.toLowerCase();
        await application.save()

        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}