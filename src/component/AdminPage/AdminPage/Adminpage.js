import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminDashboard from '../AdminDasboard/AdminDashboard';
import ReservationApproved from '../ReservationApproved/ReservationApproved';
import ReservationRequest from '../ReservationRequest/ReservationRequest';
import AdminCalendar from '../AdminCalendar/AdminCalendar';
import ReservationHistory from '../ReservationHistory/ReservationHistory';
import http from '../../../http';
import { setReservation, setPendingCount} from '../../../redux/actions/libraryActions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Login/authentication'; 


export default function Adminpage() {

    /*====Navigation condition code start here====*/
    const [visibleSection, setVisibleSection] = useState('dashboard');

    const handleMenuClick = (section) => {
      setVisibleSection(section);
    };

    /*====Navigation condition code end here====*/
    const pendingCount = useSelector(state => state.allReservations.pendingCount);
    const dispatch = useDispatch();
  

    const displayReservation = () => {
      http.get('reservations')
        .then(result => {
          console.log('API Result:', result.data);
          dispatch(setReservation(result.data.reservation));
          const count = countPendingReservations(result.data.reservation);
          dispatch(setPendingCount(count));
        })
        .catch(error => {
          console.log(error.message);
        });
    };
    
    const countPendingReservations = (reservations) => {
      const pendingCount = reservations.filter(reservation => reservation.Status === 'Pending').length;
      console.log('Number of Pending Reservations:', pendingCount);
      return pendingCount;
    };

    useEffect(() => {
      displayReservation();
    }, []);

    const { login, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
      logout();
      navigate('/Sucasaadminloginpage');
    };

  return (

    <>
      <nav className="navbar navbar-expand-lg bg-body-primary fixed-top">
          <div className="container-fluid">
            <button 
              className="navbar-toggler me-3" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#SidePanelMenu" 
              aria-controls="SidePanelMenu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <a id='AdminMenu' className="navbar-brand fw-bold me-auto">SU-CASA-ADMIN</a>

          </div>
        </nav>

      <div className="offcanvas offcanvas-start bg-primary" tabindex="-1" id="SidePanelMenu" aria-labelledby="SidePanelMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold" id='AdminMenu'>Menu</h5>
        </div>
     
        <div className="offcanvas-body p-1 mt-2">
          
          <button 
            id='SideNavName' 
            type="button" 
            className="btn"
            onClick={() => handleMenuClick('dashboard')}
            style={{ textAlign: 'start'}}
           >
              <span className=' me-2'>
                <i class="bi bi-speedometer2"> </i>
              </span>
              <label className='fw-bold'>Dashboard</label>  

          </button>                
         
          <button 
            id='SideNavName' 
            type="button" 
            className="btn"
            onClick={() => handleMenuClick('reservationRequest')}
            style={{ textAlign: 'start' }}
          >
            <span className=' me-2'>
              <i class="bi bi-calendar"> </i>
            </span>
            <label className='fw-bold'>Reservation Request  <span className="badge text-bg-danger">{pendingCount}</span></label> 
                     
          </button>
           
          <button 
            id='SideNavName' 
            type="button" 
            className="btn"
            onClick={() => handleMenuClick('reservationHistory')}
            style={{ textAlign: 'start' }}
          >
            <span className=' me-2'>
              <i class="bi bi-clock-history"> </i>
            </span>
            <label className='fw-bold'>Reservation History </label> 
                      
          </button>        
        </div>

        <div className='p-1'>
          <button 
            id='SideNavName' 
            type="button" 
            className="btn mb-3"
            onClick={handleLogout}
            style={{ textAlign: 'start' }}
          >
            <span className=' me-2'>
              <i class="bi bi-box-arrow-left"></i>
            </span>
            <label className='fw-bold'>LogOut</label>               
          </button>
        </div>
      </div>


      <div className='APMain'>
      {visibleSection === 'dashboard' && (
          <div id='AdminContentsDashboard' classNameName="container">
              <h1>Dashboard</h1>
              <hr></hr>
              <AdminCalendar/>
              <br></br>
              <ReservationApproved/>
          </div>

          )} {visibleSection === 'reservationRequest' && (
          <div id='ResevationRequest' classNameName='container'>
              <h1>Resevation Request</h1>
              <hr></hr>
              <AdminCalendar/>
              <br></br>
              <ReservationRequest/>
          </div>
          )} 
          {visibleSection === 'reservationHistory' && (
          <div id='ResevationHistory' classNameName='container'>
              <h1>Resevation History</h1>
              <hr></hr>
              <ReservationHistory/>
          </div>
            )}

      </div>

    </>

  )
}
