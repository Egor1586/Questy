function renderAuthorStart() {
    const roomContent = document.getElementById("room-content");
    roomContent.innerHTML = ""; 
    roomContent.className= "author-content"

    const style = document.createElement('style')
    document.head.appendChild(style)


    const block1 = document.createElement('div')
    block1.className = 'block1'
    block1.textContent = 'Хто з учнів на яке питання відповів'

    const bottomContainer = document.createElement('div')
    bottomContainer.className = 'bottom-container'

    const block2 = document.createElement('div')
    block2.className = 'block2'
    block2.textContent = 'Інформація про питання'

    const block3 = document.createElement('div')
    block3.className = 'block3'
    block3.textContent = 'Статистика відповідей'

    bottomContainer.appendChild(block2)
    bottomContainer.appendChild(block3)

    const nextButton = document.createElement('button')
    nextButton.className = 'next-button'
    nextButton.textContent = 'Наступне питання'

    roomContent.appendChild(block1)
    roomContent.appendChild(bottomContainer)
    roomContent.appendChild(nextButton)
}