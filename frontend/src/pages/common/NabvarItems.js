import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';

const NavbarItems = () => {
  const { userRole } = useContext(AuthContext);

  return (
    <>
      {/* Strategic Coordinator */}
      {userRole === 'strategic_coordinator' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/coordinator-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              Gestión de Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/practices">
              Prácticas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tasks">
              Tareas
            </Link>
          </li>
        </>
      )}

      {/* President */}
      {userRole === 'president' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/president-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              Gestión de Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/practices">
              Prácticas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tasks">
              Tareas
            </Link>
          </li>
        </>
      )}

      {/* Vice President */}
      {userRole === 'vice_president' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/vp-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              Gestión de Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/practices">
              Prácticas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tasks">
              Tareas
            </Link>
          </li>
        </>
      )}

      {/* Leader */}
      {userRole === 'leader' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/leader-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/practices">
              Prácticas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tasks">
              Tareas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/team-management">
              Gestión de Equipos
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/practices">
              Control de Asistencias
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/usermessages">
              Mensajes
            </Link>
          </li>
        </>
      )}

      {/* Member */}
      {userRole === 'member' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/memberview">
              Mi Vista
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default NavbarItems;