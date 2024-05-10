// ==UserScript==
// @name         ChatGPT TTS Reader
// @namespace    https://github.com/jijihome/ChatGPT-TTS-Reader
// @version      0.1
// @description  为 ChatGPT 对话页面启用文字转语音功能
// @author       jijihome
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

let isReading = false // 标记是否正在朗读

// 添加朗读按钮到页面
function addReadButtons(conversationElement) {
    console.log("添加朗读按钮...")
    if (!conversationElement.querySelector(".read-button")) {
        const readButton = createButton("朗读", "read-button", function () {
            if (isReading) {
                pauseReading() // 暂停朗读
            } else {
                startReading() // 开始朗读
            }
        })
        conversationElement.appendChild(readButton)
        console.log("朗读按钮已添加到对话元素。")
        addStopButton(conversationElement)
    } else {
        console.log("朗读按钮已存在。")
    }
}

// 创建按钮
function createButton(text, className, clickHandler) {
    const button = document.createElement("button")
    button.textContent = text
    button.className = className
    button.style.marginLeft = "10px"
    button.addEventListener("click", clickHandler) // 添加事件处理程序
    return button
}

// 添加停止朗读按钮
function addStopButton(parentElement) {
    console.log("添加停止朗读按钮，父元素：", parentElement)
    const stopButton = createButton("停止朗读", "stop-button", function () {
        stopCurrentReading() // 停止当前朗读
        console.log("停止朗读按钮已点击。")
    })
    parentElement.appendChild(stopButton)
    console.log("停止朗读按钮已添加到对话元素。")
}

// 开始朗读
function startReading() {
    console.log("开始朗读...")
    isReading = true // 设置朗读标志为 true
    const readButton = event.target // 获取点击的朗读按钮
    const conversationElement = readButton.parentElement.parentElement.previousElementSibling // 获取上一个对话元素
    if (conversationElement) {
        console.log("找到要朗读的对话内容：", conversationElement.innerText)
        readTextFromDiv(conversationElement) // 开始朗读上一个对话内容
    } else {
        console.log("未找到要朗读的对话内容。")
    }
}

// 暂停朗读
function pauseReading() {
    console.log("暂停朗读...")
    isReading = false // 设置朗读标志为 false
    const speechSynthesis = window.speechSynthesis
    if (speechSynthesis.speaking) {
        speechSynthesis.pause()
        console.log("当前的朗读任务已暂停。")
    }
}

// 停止朗读
function stopCurrentReading() {
    console.log("停止当前的朗读任务...")
    const speechSynthesis = window.speechSynthesis
    if (isReading && speechSynthesis.speaking) {
        speechSynthesis.cancel()
        isReading = false // 设置朗读标志为 false
        console.log("当前的朗读任务已停止。")
    }
}

// 朗读上一个 div 元素的文本
function readTextFromDiv(previousDiv) {
    console.log("正在朗读上一个 div 元素的文本...")
    const divText = previousDiv.innerText
    const speechSynthesis = window.speechSynthesis
    const speechUtterance = new SpeechSynthesisUtterance(divText)
    speechUtterance.rate = 1.75 // 加快朗读速度
    speechSynthesis.speak(speechUtterance)
    isReading = true // 设置朗读标志为 true
}

// 初始化
function init() {
    console.log("正在初始化 ChatGPT TTS Reader 脚本...")
    const conversationElements = document.querySelectorAll(".text-gray-400")
    conversationElements.forEach(addReadButtons)
}

// 创建 MutationObserver 实例
const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
            console.log("对话元素已加载！")
            init() // 执行初始化操作
            break
        }
    }
})

// 开始观察 mian 标签的变化
const mainContent = document.querySelector("main")
if (mainContent) {
    observer.observe(mainContent, { childList: true, subtree: true })
}
