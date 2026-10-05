import axios from 'axios';
import { defineStore } from 'pinia';


export const useDoctorSchedules = defineStore({
    id: 'doctorSchedules',
    state: () => ({
        startTime: null,
        endTime: null,
        availableTimes: null,
        message: null,
		isAvailable: 0 
    }),

    actions: {
        async fetchTimes() {
            try{
                await axios.get('/doctor-schedules-fetch-times').then((res)=>{
                    this.startTime = res.data.data.start_time
                    this.endTime = res.data.data.end_time
                    this.message = res.data.data.message
                }).catch((err)=>{
                    console.log(err)
                })
            }
            catch(error){
                console.log(error)
            }
        },

        async fetchAvailability() {
            try{
                await axios.get('/doctor-schedules-fetch-availability').then((res)=>{
                    this.availableTimes = res.data
                }).catch((err)=>{
                    console.log(err)
                })
            }
            catch(error){
                console.log(error)
            }
        },
		//adding new method to check if dr is available
		async fetchIsAvailable() {
            try{
                await axios.get('/doctor-schedules-fetch-doctors-availability').then((res)=>{  
                    this.isAvailable = res.data
					console.log(["Docts availability from doctorSchedules.js" ,res.data, this.isAvailable]);  
                }).catch((err)=>{
                    console.log(err)
                })
            }
            catch(error){
                console.log(error)
            }
        }
    }

});

