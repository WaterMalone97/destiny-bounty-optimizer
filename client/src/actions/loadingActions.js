export const isLoading = () => (dispatch) => {
    dispatch({
        type: 'LOADING',
    })
}

export const doneLoading = () => (dispatch) => {
    dispatch({
        type: 'DONE_LOADING',
    })
}

export const loadPage = () => (dispatch) => {
    dispatch({
        type: 'LOAD_PAGE',
    })
}