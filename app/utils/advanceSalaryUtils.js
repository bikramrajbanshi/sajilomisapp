import APIKit from "../shared/APIKit"
import Toast from "react-native-toast-message";

export const getAdvanceSalaryType = async() => {
    try {
        const response = await APIKit.get(`/deduction/AdvanceDeductionType`);
        return response.data.map((item) => ({
            id: item.deductionId,
            name: item.deductionName
        }));
       
    } catch (error) {
        console.error('Error fetching advance deduction type list:', error);
        throw error;
    }
};