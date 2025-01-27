import APIKit from "../shared/APIKit";

export const listApproverRecommender = async (userId) => {
    try {
        const response = await APIKit.get(`/account/GetApproverRecommenderNotifierByUser/${userId}`);
        
        const approverData = response.data.filter(
            (item) => item.approverId !== null
        );

        const recommenderData = response.data.filter(
            (item) => item.recommenderId !== null
        );

        const approved = approverData.map((item) => ({
            id: item.approverId, 
            name: `${item.approverFirstName} ${item.approverLastName} (${item.approverId})`
        }));

        const recommended = recommenderData.map((item) => ({
            id: item.recommenderId, 
            name: `${item.recommenderFirstName} ${item.recommenderLastName} (${item.recommenderId})`
        }));

        // console.log(approved);

        return {
            'approver': approved,
            'recommender': recommended
        };
    } catch (error) {
        // Handle errors here
        console.error("Error fetching approver and recommender data:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
};
