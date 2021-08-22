import { storageService } from './storage-service.js'
// import axios from '../lib/axios.js'
import data from '../../data/users.js'
var gUser = data.user
const codeLength = 5

const base_url = "https://api.face-int.com"



export const enrollmentService = {
    getVerificationCode,
    validateVerificationCode,
    startEnrollmentProccess,
}

// this is the axios request need to be tested

// function getVerificationCode(phoneNumber) {
//     const data = {'phoneNumber':phoneNumber}
//     const prm = axios.get(base_url + '/GetVerificationCode', data)
//         .then(res => { res.data })
//         .then(data => console.log(data))
//     return prm;
// }

// function validateVerificationCode(codeNumber, phoneNumber) {
//     const data = { 'codeNumber': codeNumber, 'phoneNumber': phoneNumber }
//     const prm = axios.get(base_url + 'validateVerificationCode', data)
//         .then(res => res.data)
//     return prm;
// }

// function startEnrollmentProccess(userId, gateId, onSuccess) {
//     const data = {'userId':userId, 'gateId': gateId}
//     const prm = axios.get(base_url +'startEnrollmentProccess', data)
//         .then(res => res.data)
// }

var count = 0


function getVerificationCode(phoneNumber) {
    var user = _getUserByPhone(phoneNumber)
    if (user) {
        return {
            'userId': user.id,
            'name': user.userName,
        }
    } else {
        return 'Invalid phone number'
    }
}
function validateVerificationCode(codeNumber, phoneNumber ) {
    var user = _getUserByCode(codeNumber)
    if (user) return 'success'
    else return 'Incorrect Code'
}

function startEnrollmentProccess(userId, gateId, onSuccess) {
    console.log('userId: ' + userId)
    console.log('gateId: ' + gateId)
    if (userId) {
        var intervalForPending = setInterval(() => {
            count++
            if (count > 3) {
                clearInterval(intervalForPending)
                CloseEnrollmentApp(gateId)
                onSuccess('success')
                // return 'success'
            }
            return 'pending'
        }, 1000)
    }
    return intervalForPending
}

function CloseEnrollmentApp(gateId) {
    console.log('gata', gateId, 'is closing!')
}


function _getUserByPhone(phoneNumber) {
    var user = gUser.find((user) => {
        return user.phoneNumber === phoneNumber
    })
    return user
}
function _getUserByCode(codeNumber) {
    var user = gUser.find((user) => {
        return user.verificationCode === codeNumber
    })
    return user
}

