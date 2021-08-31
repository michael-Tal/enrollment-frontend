import { storageService } from '../services/storage-service.js'
import { enrollmentService } from '../services/enrollment.service.js'

window.onload = onInit;
window.onPhoneEnter = onPhoneEnter;
window.onCodeEnter = onCodeEnter;
window.onStartEnrollmentProccess = onStartEnrollmentProccess;

var gPhoneNumber;
var gUserId;
var gGateId;
const KEY = 'gateId'

export function onInit() {
    show('main-phone-number')
    var gateId = storageService.loadFromStorage(KEY)
    // var phoneAudio = new Audio('../../assets/sound/phone-enter.ogg')
    const phoneAudio = document.querySelector('.phone-enter-audio')
    setTimeout(() => {
        phoneAudio.play()
    }, 1000);

    if (gateId) gGateId = gateId
    else {
        gGateId = prompt('please enter Gate')
        storageService.saveToStorage(KEY, gGateId)
    }
}

export async function onPhoneEnter(ev) {
    ev.preventDefault()
    var phoneNumber = document.querySelector('.phoneNumber').value
    var ans = await enrollmentService.getVerificationCode(phoneNumber)
    if (ans?.userId) {
        document.querySelector('.phoneNumber').disabled = true
        document.querySelector('.phone-lable').innerText = 'phone number'
        document.querySelector('.phone-lable').style.fontSize = '30px'
        document.querySelector('.phone-btn').style.display = 'none'
        document.querySelector('.main-phone-number').style.display = 'block'
        gUserId = ans.userId
        gPhoneNumber = phoneNumber
        show('main-code-number')
        document.querySelector('.code-enter-audio').play()
    } else {
        //TODO: create a div with err massage for incorrect phone number
        console.log("ans in error")
    }
}

export async function onCodeEnter(ev) {
    ev.preventDefault()
    var codeNumber = +document.querySelector('.codeNumber').value
    var ans = await enrollmentService.validateVerificationCode(codeNumber, gUserId)
    if (ans.verification) {
        document.querySelector('.codeNumber').disabled = true
        document.querySelector('.code-lable').innerText = 'code number'
        document.querySelector('.code-lable').style.fontSize = '30px'
        document.querySelector('.code-btn').style.display = 'none'
        document.querySelector('.main-code-number').style.display = 'block'
        document.querySelector('.start-enrollment-btn').style.display = 'flex'
        document.querySelector('.look-at-camera-audio').play()
    } else {
        //TODO: create a div with err massage for incorrect phone code
        console.log('Incorrect Code')
    }
}

export async function onStartEnrollmentProccess() {
    console.log("gUserId:", gUserId)
    console.log("gGateId:", gGateId)
    var ans = await enrollmentService.startEnrollmentProccess(gUserId, gGateId)
    console.log(ans)// recive 'ok' if good
    if (ans === 'ok') {
        document.querySelector('.start-enrollment-btn').style.display = 'none'
        document.querySelector('.main-animation').style.display = 'flex'
        var audio = document.querySelector('.registration-success-audio')
        await enrollmentService.getStatus(gUserId, audio, renderSuccess)
        // await enrollmentService.getStatus(gUserId, renderSuccess)
    }
}

function renderSuccess(ans) {
    if (ans === 'Finish') {
        console.log('success')
        document.querySelector('.main-animation').style.display = 'none'
        // document.querySelector('.status-modal').innerText = 'Regisration success the app will automaticly closed thanks'
        document.querySelector('.status-modal').style.display = 'block'
        enrollmentService.closeEnrollmentApp(gGateId)
    } else {
        document.querySelector('.status-modal').innerText = 'pending'
    }
}


function show(elClass) {
    var el = document.querySelector('.' + elClass)
    el.style.display = 'flex'
}
function hide(elClass) {
    var el = document.querySelector('.' + elClass)
    el.style.display = 'none'
}