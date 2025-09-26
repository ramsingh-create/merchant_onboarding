import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate  = useNavigate()
    return (
        <button onClick={() => navigate('/SOA')}>SOA</button>
    )
}

export default Settings;