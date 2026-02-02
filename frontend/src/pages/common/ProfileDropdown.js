import React, { useState, useContext } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { AuthContext } from "../../components/AuthContext";
import ProfileSettings from "./ProfileSettings";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = () => {
    const { logout, user } = useContext(AuthContext);
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <>
            <Dropdown align="end">
                <Dropdown.Toggle
                    variant="link"
                    id="dropdown-profile"
                    className="text-white text-decoration-none d-flex align-items-center p-0 border-0"
                    style={{ boxShadow: 'none' }}
                >
                    {user?.profilePicture ? (
                        <Image
                            src={user.profilePicture}
                            roundedCircle
                            style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid white' }}
                        />
                    ) : (
                        <FaUserCircle size={32} className="text-light" />
                    )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 mt-2">
                    <div className="px-3 py-2 border-bottom">
                        <div className="fw-bold text-dark">{user?.name || "Usuario"}</div>
                        <div className="text-muted small">{user?.email}</div>
                    </div>
                    <Dropdown.Item onClick={() => setShowProfileModal(true)} className="py-2">
                        Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger py-2">
                        Cerrar Sesión
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <ProfileSettings show={showProfileModal} onHide={() => setShowProfileModal(false)} />
        </>
    );
};

export default ProfileDropdown;
