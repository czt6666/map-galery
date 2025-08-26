const header = document.querySelector('header')
const tabbar = document.querySelector('.tabbar')

changerouter()
window.addEventListener('resize', changerouter)

function changerouter() {
    const clientWidth = document.body.clientWidth;
    if (clientWidth <= 820) {
        // 移动端 tabbar
        header.style.display = 'none'
        tabbar.style.display = 'block'
    } else {
        // pc端 header
        header.style.display = 'flex'
        tabbar.style.display = 'none'
    }
}