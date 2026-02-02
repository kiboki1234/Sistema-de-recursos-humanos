import React, { useState } from "react";
import PracticesList from "./PracticesList";
import CreatePractice from "./CreatePractice";
import CalendarComponent from "./CalendarComponent";
import UserAttendanceChart from "./AttandanceChart";
import Footer from "../common/Footer";

const AdminDashboard = () => {

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="container pt-4 mt-4 flex-grow-1">
                <h1 className="mb-4 mt-4">Panel de Administrador</h1>
                {/* <CalendarComponent practices={practices}/> */}
                <CalendarComponent />
                <div className="row gx-5">
                    <div className="col">
                        <CreatePractice />
                    </div>
                    <div className="col">
                        <PracticesList />
                    </div>
                </div>
                <div className="row">
                    <UserAttendanceChart />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
