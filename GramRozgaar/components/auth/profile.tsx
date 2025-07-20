import { authFetch } from "@/services/authFetch";
import { API_URL } from "@/services/API";
import { useEffect, useState } from "react";
import { selectCurrentUser, selectCurrentLanguage, selectCurrentTheme } from "@/store/Seletor";
import { useSelector } from "react-redux";

const profile = () => {
    const [theme, setTheme] = useState();
    const [isAvailableForWork, setIsAvailableForWork] = useState(false);
    const [workType, setWorkType] = useState('');
    const [isMachineAvailale, setIsMachineAvailable] = useState(false);
    const [machineType, setmachineType] = useState('');


    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await authFetch(`${API_URL}/users/user-profile?phoneNumber=${user.phoneNumber}`, {
                method: 'GET',
            });
            if (!res.ok) throw new Error("Failed to fetch image");

        }
        fetchUserInfo();
    }, []);

    return (
        <>

        </>
    )
}
export default profile;