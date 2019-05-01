import iconClose from './iconClose'
import iconUp from './iconUp'
import iconLoading from './iconLoading'
const components = [iconClose,iconUp,iconLoading]
export default {
    install(Vue) {
        components.map(component => {
            Vue.component(component.name, component);
        });
    }
}