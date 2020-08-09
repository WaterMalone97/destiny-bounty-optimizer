const defaultState = {
    loading: null,
    loadPage: null
  }
  
const rootReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'LOADING':
            return {loading: true, loadPage: false}
        case 'DONE_LOADING':
            return {...state, loading: false}
        case 'LOAD_PAGE':
            return {...state, loadPage: true}
        default: 
            return state;
    }
}
  
export default rootReducer;