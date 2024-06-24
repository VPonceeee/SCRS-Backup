import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import http from '../../../http';
import { setReservation } from '../../../redux/actions/libraryActions';

export default function ReservationHistory() {
    const reservations = useSelector(state => state.allReservations.reservations);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ========================== DISPLAY THE DATA FROM THE DATABASE CODES START HERE ==========================
    const displayReservation = () => {
        http.get('reservations')
            .then(result => {
                console.log('API Result:', result.data);
                dispatch(setReservation(result.data.reservation));
            })
            .catch(error => {
                console.log('API Error:', error.message);
            });
    };

    useEffect(() => {
        displayReservation();
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }, []);
    // ========================== DISPLAY THE DATA FROM THE DATABASE CODES END HERE ==========================

    // ========================== MODAL CODES START HERE ==========================
    const [modalData, setModalData] = useState(null);
    const [completedChecked, setCompletedChecked] = useState(false);
    const [declinedChecked, setDeclinedChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleViewClick = (data) => {
        setModalData(data);
        const modal = new window.bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
    };
    // ========================== MODAL CODES END HERE ==========================

    // ========================== FILTER AND SEARCH THE DATA FROM THE DATABASE CODES START HERE ==========================
    const filterReservations = () => {
        return reservations.filter(reservation => 
            ((completedChecked && reservation.Status === 'Completed') || 
            (declinedChecked && reservation.Status === 'Declined') ||
            (!completedChecked && !declinedChecked && (reservation.Status === 'Completed' || reservation.Status === 'Declined'))) &&
            reservation.Fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleCompletedChange = () => {
        setCompletedChecked(!completedChecked);
    };

    const handleDeclinedChange = () => {
        setDeclinedChecked(!declinedChecked);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        filterReservations();
    };
    // ========================== FILTER AND SEARCH THE DATA FROM THE DATABASE CODES END HERE ==========================

    // ========================== PAGINATION CODES START HERE ==========================
    const paginate = (items, pageNumber, pageSize) => {
        const start = (pageNumber - 1) * pageSize;
        return items.slice(start, start + pageSize);
    };

    const filteredReservations = filterReservations();
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const displayedReservations = paginate(filteredReservations, currentPage, itemsPerPage);
    // ========================== PAGINATION CODES END HERE ==========================

    return (
        <>
            <div className='container'>
                <div className="d-flex align-items-end flex-row gap-2 mb-3 ">
                    <div className='col d-flex flex-row gap-2'>
                        <div className="input-group gap-1">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search" 
                                aria-label="Search" 
                                aria-describedby="button-addon2" 
                                value={searchTerm} 
                                onChange={handleSearchChange}
                            />
                            <button className="btn btn-primary" type="button" id="button-addon2" onClick={handleSearchClick}>
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                        <button className="btn btn-primary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Filter
                        </button>

                        <ul className="dropdown-menu">
                            <div className="form-check ms-2">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value="" 
                                    id="completedCheck" 
                                    checked={completedChecked} 
                                    onChange={handleCompletedChange}
                                />
                                <label className="form-check-label" htmlFor="completedCheck">Completed</label>
                            </div>
                            <div className="form-check ms-2">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value="" 
                                    id="declinedCheck" 
                                    checked={declinedChecked} 
                                    onChange={handleDeclinedChange}
                                />
                                <label className="form-check-label" htmlFor="declinedCheck">Declined</label>
                            </div>
                        </ul>
                    </div>
                </div>
                
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Fullname</th>
                            <th scope="col">Contact</th>
                            <th scope="col">Event</th>
                            <th scope="col">Start Date<br/>(YY-MM-DD)</th>
                            <th scope="col">End Date<br/>(YY-MM-DD)</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(reservations) && reservations.length > 0 ? (
                            displayedReservations.map(showReservation => (
                                <tr key={showReservation.ReservationId}>
                                    <td>{showReservation.Fullname}</td>
                                    <td>{showReservation.Email} <br/>{showReservation.MobileNo}</td>
                                    <td>{showReservation.Events}</td>
                                    <td>{showReservation.StartDate}</td>
                                    <td>{showReservation.EndDate}</td>
                                    <td>{showReservation.Status}</td>
                                    <td>
                                        <div className='ActionBtn'>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleViewClick(showReservation)}
                                                data-bs-toggle="tooltip"
                                                title="View"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No reservations available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={prevPage}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => goToPage(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={nextPage}>Next</button>
                        </li>
                    </ul>
                </nav>
                
                <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewModalLabel">View Full Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {modalData && (
                                    <div>
                                        <p><strong>Full Name:</strong> {modalData.Fullname}</p>
                                        <p><strong>Mobile Number:</strong> {modalData.MobileNo}</p>
                                        <p><strong>Email:</strong> {modalData.Email}</p>
                                        <p><strong>Date of Reservation:</strong> {modalData.StartDate} - {modalData.EndDate}</p>
                                        <p><strong>Kids#:</strong> {modalData.KidsQty}</p>
                                        <p><strong>Adults#:</strong> {modalData.AdultsQty}</p>
                                        <p><strong>Seniors#:</strong> {modalData.SeniorsQty}</p>
                                        <p><strong>Event:</strong> {modalData.Events}</p>
                                        <p><strong>Services:</strong> {modalData.Services}</p>
                                        <p><strong>Food Requests:</strong> {modalData.CateringFoods}</p>
                                        <p><strong>Total Bill:</strong> ₱{modalData.Total}</p>
                                        <p><strong>Status:</strong> {modalData.Status}</p>
                                        <img src={modalData.ReservationFee} className="img-fluid" style={{ maxWidth: '100%', maxHeight: '400px' }} alt="Reservation Fee" />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
