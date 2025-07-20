
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "@/services/API";
import { authFetch } from "@/services/authFetch";
import {
    selectCurrentUser,
    selectCurrentLanguage,
    selectCurrentTheme,
} from "@/store/Seletor";

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await authFetch(`${API_URL}/users/user-profile`, {
                    method: "GET",
                });
                console.log(res);
                if (!res.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const data = await res.json();
                console.log("Fetched userInfo:", data);
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching userInfo:", error);
            }
        };

        if (user) {
            fetchUserInfo();
        }
    }, [user]);

    return (
        <>{userInfo && <pre>{JSON.stringify(userInfo, null, 2)}</pre>}</>
    );
};

export default Profile;