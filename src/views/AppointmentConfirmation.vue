<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { Toaster, toast } from 'vue-sonner';
import { useGetUserData } from '../stores/getUserData';

const props = defineProps({
    appointmentData: {
        type: Object,
        default: () => null
    }
});

const router = useRouter();
const userDataStore = useGetUserData();
const rawData = ref(null);

onMounted(() => {
    // 1. Check props
    if (props.appointmentData && Object.keys(props.appointmentData).length > 0) {
        rawData.value = props.appointmentData;
    }
    // 2. Check history.state
    else if (history.state?.appointmentData) {
        rawData.value = history.state.appointmentData;
    } else if (history.state && (history.state.doctor || history.state.date || history.state.appointment_id)) {
        rawData.value = history.state;
    }
    // 3. Check sessionStorage fallback
    else {
        try {
            const saved = sessionStorage.getItem('appointment_confirmation');
            if (saved) {
                rawData.value = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to read appointment from sessionStorage', e);
        }
    }

    if (rawData.value?.message) {
        toast.success(rawData.value.message);
    }
});

const doctor = computed(() => {
    return (
        rawData.value?.doctor ||
        rawData.value?.doctor_name ||
        rawData.value?.appointment?.doctor?.name ||
        rawData.value?.appointment?.doctor_name ||
        'Not Specified'
    );
});

const patientName = computed(() => {
    return (
        rawData.value?.patient ||
        rawData.value?.patient_name ||
        rawData.value?.appointment?.user?.name ||
        rawData.value?.appointment?.patient_name ||
        userDataStore.name ||
        'Valued Patient'
    );
});

const date = computed(() => {
    return (
        rawData.value?.date ||
        rawData.value?.appointment?.date ||
        'Not Specified'
    );
});

const time = computed(() => {
    return (
        rawData.value?.time ||
        rawData.value?.start_time ||
        rawData.value?.appointment?.start_time ||
        rawData.value?.startTime ||
        'Not Specified'
    );
});

const day = computed(() => {
    return (
        rawData.value?.day ||
        rawData.value?.appointment?.day ||
        ''
    );
});

const orderId = computed(() => {
    return (
        rawData.value?.order_id ||
        rawData.value?.appointment?.order_id ||
        (rawData.value?.appointment_id ? `#APT-${rawData.value.appointment_id}` : '')
    );
});

const goHome = () => {
    router.push('/');
};

const goToAppointments = () => {
    router.push('/patient-appointments');
};

const printConfirmation = () => {
    window.print();
};
</script>

<template>
    <div class="min-h-screen flex flex-col justify-between overflow-x-hidden bg-bgcolor dark:bg-darkmodebg">
        <Toaster richColors position="top-right" />
        <div class="h-fit print:hidden">
            <Header />
        </div>

        <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div v-motion-slide-visible-top
                class="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-10 transition-all duration-300">
                
                <!-- Success Header -->
                <div class="text-center">
                    <div
                        class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-4 flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50 dark:ring-emerald-900/30">
                        <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white font-recursive">
                        Appointment Confirmed!
                    </h1>
                    <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        Your appointment has been successfully registered. Please find your reservation details below.
                    </p>

                    <div v-if="orderId" class="mt-3 inline-block bg-blue-50 dark:bg-blue-900/30 text-primarycolor dark:text-blue-300 font-mono text-xs sm:text-sm px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        Booking ID: {{ orderId }}
                    </div>
                </div>

                <!-- Appointment Details Card -->
                <div class="mt-8 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                    
                    <!-- Patient Name -->
                    <div class="py-3.5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primarycolor dark:text-blue-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <span class="text-sm font-medium">Patient Name</span>
                        </div>
                        <span class="text-base font-semibold text-gray-900 dark:text-white text-right">
                            {{ patientName }}
                        </span>
                    </div>

                    <!-- Doctor -->
                    <div class="py-3.5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <span class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span class="text-sm font-medium">Doctor</span>
                        </div>
                        <span class="text-base font-semibold text-primarycolor dark:text-blue-400 text-right">
                            {{ doctor }}
                        </span>
                    </div>

                    <!-- Date & Day -->
                    <div class="py-3.5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <span class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <span class="text-sm font-medium">Date</span>
                        </div>
                        <span class="text-base font-semibold text-gray-900 dark:text-white text-right">
                            {{ date }} <span v-if="day" class="text-sm font-normal text-gray-500 dark:text-gray-400">({{ day }})</span>
                        </span>
                    </div>

                    <!-- Time -->
                    <div class="py-3.5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <span class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span class="text-sm font-medium">Time Slot</span>
                        </div>
                        <span class="text-base font-semibold text-gray-900 dark:text-white text-right">
                            {{ time }}
                        </span>
                    </div>

                    <!-- Status -->
                    <div class="py-3.5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <span class="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span class="text-sm font-medium">Status</span>
                        </div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Confirmed
                        </span>
                    </div>
                </div>

                <!-- Helpful Instructions -->
                <div class="mt-6 p-4 rounded-xl bg-blue-50/70 dark:bg-slate-700/20 border border-blue-100 dark:border-slate-700 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-primarycolor dark:text-blue-300 mb-1">
                        Important Information:
                    </p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Please arrive at the clinic at least 15 minutes prior to your appointment time.</li>
                        <li>A confirmation notification has been dispatched to your registered email address.</li>
                    </ul>
                </div>

                <!-- Actions -->
                <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
                    <button @click="goHome" type="button"
                        class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition duration-200">
                        Go to Home
                    </button>
                    <button @click="goToAppointments" type="button"
                        class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-primarycolor hover:bg-blue-600 transition duration-200 shadow-md shadow-blue-500/20">
                        My Appointments
                    </button>
                    <button @click="printConfirmation" type="button"
                        class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-200">
                        Print Slip
                    </button>
                </div>
            </div>
        </main>

        <div class="print:hidden">
            <Footer />
        </div>
    </div>
</template>

<style scoped>
@media print {
    body {
        background: white !important;
        color: black !important;
    }
}
</style>

