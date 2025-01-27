import { useEffect, useState } from "react"
import { getModuleName } from "../getModuleName";


export const useModuleName = () => {
    const [moduleName, setModuleName] = useState(null);

    useEffect(() => {
        const fetchModuleName = async () => {
            const name = await getModuleName();
            if (name) {
                setModuleName(name);
            }
        };

        fetchModuleName();
    }, []);

    return moduleName;
};
