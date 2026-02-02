import React from "react";
import { Dropdown } from "react-bootstrap";

const ProfileDropdown = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Perfil
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item to="/profile"> {/*as={Link}*/}
                    Perfil
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}> {/*}*/}
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
