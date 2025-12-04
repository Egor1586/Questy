$(() => {
    $(".hide-btn").on("click", () => {
        $(".sidebar-classroom").toggleClass("hidden-sidebar")
        $(".content").toggleClass("full-content")
        
        $(".hide-btn").toggleClass("move-left")
        $(".hide-btn").toggleClass("rotate")
    })
})
