var gInterval;
var count = 0;
const HEADER = { 'Content-Type': 'application/json' }

const base_url = 'https://api.face-int.com'

export const enrollmentService = {
    getVerificationCode,
    validateVerificationCode,
    startEnrollmentProccess,
    getStatus,
    closeEnrollmentApp
}

// this is the axios request need to be tested

function getVerificationCode(phoneNumber) {
    const data = { 'phoneNumber': phoneNumber }
    const prm = axios.post(base_url + '/GetVerificationCode', data, { headers: HEADER })
        .then(res => res.data)
        .catch(err => console.dir(err.stack))
    return prm;
}

async function validateVerificationCode(verificationCode, userId) {
    const data = { 'userId': userId, 'verificationCode': verificationCode }
    const prm = await axios.post(base_url + '/ValidateVerificationCode', data, { headers: HEADER })
        .then(res => res.data)
    return prm;
}

async function startEnrollmentProccess(userId, gateId) {
    const data = { 'userId': userId, 'gateId': gateId }
    const prm = await axios.post(base_url + '/StartEnrollmentProcess', data, { headers: HEADER })
        .then(res => res.data)
    return prm;
}

async function getStatus(userId, onSuccess) {
    gInterval = await setInterval(getEnrollmentStatus, 1000, userId, onSuccess)
}

async function getEnrollmentStatus(userId, cb) {
    count++
    const data = { 'userId': userId }
    const prm = await axios.post(base_url + '/GetEnrollmentStatus', data, { headers: HEADER })
        .then(res => res.data)
        .then(ans => {
            if (ans.status === 'Finish' || count > 3) {
                ans.status = 'Finish'
                clearInterval(gInterval)
                cb(ans.status)
            }
        })
        .catch(err => console.log(err))
    return prm
}

async function closeEnrollmentApp(gateId) {
    const data = { 'gateId': gateId }
    console.log('gata', gateId, 'is closing!')
    const prm = await axios.post(base_url + '/CloseEnrollmentApp', data, { headers: HEADER })
        .then(res => res.data)
    return prm;
}