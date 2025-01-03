import { defineStore } from 'pinia';

interface DrawerState {
  _isVisible: boolean;
  _currentComponent: string | null;
}

export const useDrawerStore = defineStore('drawer-store', {
  state: (): DrawerState => ({
    _isVisible: false,
    _currentComponent: null,
  }),
  getters: {
    isVisible: state => state._isVisible,
    currentComponent: state => state._currentComponent,
  },
  actions: {
    show(component: string) {
      this._currentComponent = component;
      this._isVisible = true;
    },
    hide() {
      this._isVisible = false;
      this._currentComponent = null;
    },
    toggle(component: string) {
      if (this.currentComponent === component && this.isVisible) {
        this.hide();
      } else {
        this.show(component);
      }
    },
  },
});
