import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

function handleSubmit() {
    // e.preventDefault()

    // const data = new FormData(form)

    // user's chatstripe
    // chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    // form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    // document.getElementById("submit").addEventListener("click", Submit)

    // function Submit() {
let prompt=document.getElementById('prompt');

        // e.preventDefault()
        // let prompt = document.getElementById("prompt").value;
        console.log(prompt.value);
       let data = {
            'prompt': prompt.value
        }

        data = JSON.stringify(data);
       let params = {
            method: 'post',
            credentials:"include",
            headers: {

                'Content-Type': 'application/json'
            },
            cache:"no-cache",
            
            body: data
        }

        fetch('http://localhost:5000/model', params).then(function (respone) {
            return respone.json()
        }).then(function (data) {
            let respone = document.getElementById("chat_container")
            console.log(data);
            console.log(data.answers[0].answer);
            respone = data.answers[0].answer
            clearInterval(loadInterval)
            messageDiv.innerHTML = " "
        
            
                // const data = await response.json();
                const parsedData = respone // trims any trailing spaces/'\n' 
        
                typeText(messageDiv, parsedData)
        })

    // }




    
}

document.getElementById("submit").addEventListener("click", handleSubmit)
document.getElementById("submit").addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit()
    }
})