import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../store/themeSlice'

const ThemeToggle = () => {
    const dispatch = useDispatch()

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
        >
            Toggle Theme
        </button>
    )
}

export default ThemeToggle