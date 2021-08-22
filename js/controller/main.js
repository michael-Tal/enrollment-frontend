import {storageService} from '../services/storage-service.js'
import {enrollmentService} from '../services/enrollment.service.js'

window.onload = onInit;
window.onPhoneEnter = onPhoneEnter;
window.onCodeEnter = onCodeEnter;
window.onStartEnrollmentProccess = onStartEnrollmentProccess;

var gPhoneNumber;
var gUserId;
var gGateId;
const KEY = 'gateId'

export function onInit(){
    show('main-phone-number') 
    var gateId = storageService.loadFromStorage(KEY)
    // var phoneAudio = new Audio('phone-enter.ogg')
    // phoneAudio.play()
    setTimeout(() => {
        const phoneAudio = document.querySelector('.phone-enter-audio').play()
    }, 1000);
    
    if (gateId) gGateId = gateId
    else gGateId = storageService.saveToStorage(KEY, 'a-1')
}

export function onPhoneEnter(ev){
    ev.preventDefault()
    console.dir(ev)
    var phoneNumber = document.querySelector('.phoneNumber').value
    var userVerifcationCode = enrollmentService.getVerificationCode(phoneNumber)
    if (userVerifcationCode.userId){
        document.querySelector('.phoneNumber').disabled = true
        document.querySelector('.phone-lable').innerText = 'phone number'
        document.querySelector('.phone-lable').style.fontSize = '20px'
        document.querySelector('.phone-btn').style.display = 'none'
        document.querySelector('.main-phone-number').style.display = 'block'
        gUserId = userVerifcationCode.userId
        gPhoneNumber = phoneNumber
        show('main-code-number')
        const codeAudio = document.querySelector('.code-enter-audio').play()
        // var codeAudio = new Audio('phone-enter.ogg')
        // phoneAudio.play()
    } else {
        //TODO: create a div with err massage for incorrect phone number
        console.log(userVerifcationCode)
    }
}
export function onCodeEnter(ev){
    ev.preventDefault()
    var codeNumber = +document.querySelector('.codeNumber').value
    var ans = enrollmentService.validateVerificationCode(codeNumber, gPhoneNumber)
    if (ans === 'success'){
        document.querySelector('.codeNumber').disabled = true
        document.querySelector('.code-lable').innerText = 'code number'
        document.querySelector('.code-lable').style.fontSize = '20px'
        document.querySelector('.code-btn').style.display = 'none'
        document.querySelector('.main-code-number').style.display = 'block'
        document.querySelector('.loader').style.display = 'flex'
        //TODO: create a div with looding for inrollment massage

    } else if (ans === 'Incorrect Code'){
        //TODO: create a div with err massage for incorrect phone code
        console.log('faild')
    } else {
        console.log('pending')
    }
}

export function onStartEnrollmentProccess(){
    var status = enrollmentService.startEnrollmentProccess(gUserId, gGateId, renderSuccess)
}

function renderSuccess(ans){
    if (ans === 'success'){
        console.log('success')
        document.querySelector('.status-modal').innerText = 'Success'
    } else {
        document.querySelector('.status-modal').innerText = 'pending'
    }
}


function show(elClass){
    var el = document.querySelector('.'+elClass)
    el.style.display = 'flex'  
}
function hide(elClass){
    var el = document.querySelector('.'+elClass)
    el.style.display = 'none'  
}