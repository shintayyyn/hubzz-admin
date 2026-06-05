export default {
    // JOBS
    // LOCUM
    // PARTS
    getLocumAllocatedPartJobs(state) {
        let jobs = []
        if (state.locum_allocated_job_parts) {
            state.locum_allocated_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumOngoingJobs(state) {
        let jobs = []
        if (state.locum_ongoing_job_parts) {
            state.locum_ongoing_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumCompletedJobs(state) {
        let jobs = []
        if (state.locum_completed_job_parts) {
            state.locum_completed_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumApprovedJobs(state) {
        let jobs = []
        if (state.locum_approved_job_parts) {
            state.locum_approved_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumWithdrawnJobs(state) {
        let jobs = []
        if (state.locum_withdrawn_jobs) {
            state.locum_withdrawn_jobs.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumCancelledJobs(state) {
        let jobs = []
        if (state.locum_cancelled_jobs) {
            state.locum_cancelled_jobs.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    // WHOLE
    getLocumAllocatedJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
        }
        return jobs
    },
    getLocumAllocatedPrivateJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs.filter(job => job.type === 'Private')
        }
        return jobs
    },
    getLocumAllocatedPlatformJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs.filter(job => job.type === 'Platform')
        }
        return jobs
    },
    getLocumAvailableJobs(state) {
        let jobs = []
        if (state.locum_available_jobs) {
            state.locum_available_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumMatchedJobs(state) {
        let jobs = []
        if (state.locum_matched_jobs) {
            state.locum_matched_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumAppliedJobs(state) {
        let jobs = []
        if (state.locum_applied_jobs) {
            state.locum_applied_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumUnsuccessfulJobs(state) {
        let jobs = []
        if (state.locum_unsuccessful_jobs) {
            state.locum_unsuccessful_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },

    // getLocumWithdrawnJobs(state) {
    //     let jobs = []
    //     if (state.locum_withdrawn_jobs) {
    //         state.locum_withdrawn_jobs.forEach(job => {
    //             let surgery_name = ''
    //             let date_time_start = ''
    //             let date_time_end = ''
    //             let rate_name = ''
    //             let rate_type_name = ''
    //             let shift_name = ''
    //             let completed_at = ''
    //             surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
    //             date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
    //             date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
    //             rate_name = job.rate
    //             rate_type_name = job.locum_detail_rate_type.name
    //             shift_name = job.shift.name
    //             completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
    //             jobs.push({
    //                 ...job,
    //                 surgery_name,
    //                 date_time_start,
    //                 date_time_end,
    //                 completed_at,
    //                 rate_name,
    //                 rate_type_name,
    //                 shift_name
    //             })
    //         })
    //         return jobs
    //     }
    //     return []
    // },

    // PRACTICE 
    // PARTS
    getPracticeOngoingJobs(state) {
        let jobs = []
        if (state.practice_ongoing_job_parts) {
            state.practice_ongoing_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeCompletedJobs(state) {
        let jobs = []
        if (state.practice_completed_job_parts) {
            state.practice_completed_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeApprovedJobs(state) {
        let jobs = []
        if (state.practice_approved_job_parts) {
            state.practice_approved_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAllocatedPartJobs(state) {
        let jobs = []
        if (state.practice_allocated_job_parts) {
            state.practice_allocated_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    // WHOLE
    getPracticeAllocatedJobs(state) {
        let jobs = []
        if (state.practice_allocated_jobs) {
            state.practice_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let assigned_to = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                assigned_to = job.platform_job.appointed_to_locum.user.personal_detail.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                    assigned_to
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAvailableJobs(state) {
        let jobs = []
        if (state.practice_available_jobs) {
            state.practice_available_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAppliedJobs(state) {
        let jobs = []
        if (state.practice_applied_jobs) {
            state.practice_applied_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeUnfilledJobs(state) {
        let jobs = []
        if (state.practice_unfilled_jobs) {
            state.practice_unfilled_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeWithdrawnJobs(state) {
        let jobs = []
        if (state.practice_withdrawn_jobs) {
            state.practice_withdrawn_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeCancelledJobs(state) {
        let jobs = []
        if (state.practice_cancelled_jobs) {
            state.practice_cancelled_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
}
