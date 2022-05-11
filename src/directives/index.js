import MouseDragDirective from "@/directives/mouseDrag";

export default {
    install(app){
        app.directive('mouse-drag',MouseDragDirective)
    }
}
