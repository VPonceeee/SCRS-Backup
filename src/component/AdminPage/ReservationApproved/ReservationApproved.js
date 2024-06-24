import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import http from '../../../http';
import { setReservation, setSelectedReservation } from '../../../redux/actions/libraryActions';

export default function ReservationApproved() {

    const reservations = useSelector(state => state.allReservations.reservations);
    const dispatch = useDispatch();

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

    // ========================== UPDATE THE DATA FROM THE DATABASE CODES START HERE ==========================
    const getReservationId = (ReservationId) => {
        console.log('ReservationId:', ReservationId);

        const singleReservation = reservations.find(reservation => reservation.ReservationId === ReservationId);

        if (singleReservation) {
            console.log('Single Reservation before update:', singleReservation);

            singleReservation.Status = "Completed";

            CompleteReservation(singleReservation);
        } else {
            console.error('Reservation not found');
        }
    }

    const CompleteReservation = (updatedReservation) => {
        console.log('Updating Reservation:', updatedReservation);

        http.put(`reservations/${updatedReservation.ReservationId}/update`, updatedReservation)
            .then(result => {
                console.log('Update Result:', result.data);

                dispatch(setSelectedReservation(result.data.reservation));
                displayReservation();
            })
            .catch(error => {
                console.log('Update Error:', error.message);
            });
    };

    // ========================== UPDATE THE DATA FROM THE DATABASE CODES END HERE ==========================

    // ========================== MODAL CODES START HERE ==========================
    const [modalData, setModalData] = useState(null);

    const handleViewClick = data => {
        setModalData(data);
        const modal = new window.bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
    };
    // ========================== MODAL CODES END HERE ==========================

    // ========================== FILTER BY MONTHS CODES START HERE ==========================
    const [selectedMonths, setSelectedMonths] = useState([]);

    const handleMonthChange = (month) => {
        setSelectedMonths(prevSelectedMonths => {
            if (prevSelectedMonths.includes(month)) {
                return prevSelectedMonths.filter(m => m !== month);
            } else {
                return [...prevSelectedMonths, month];
            }
        });
    };

    const monthsMap = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    // ========================== FILTER BY MONTHS CODES END HERE ==========================

    // ========================== TABLE CODES START HERE ==========================
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [searchQuery, setSearchQuery] = useState("");
    const currentReservations = reservations
        .filter(reservation => reservation.Status === 'Reserved')
        .filter(reservation => {
            const reservationMonth = new Date(reservation.StartDate).getMonth();
            return selectedMonths.length === 0 || selectedMonths.includes(Object.keys(monthsMap)[reservationMonth]);
        })
        .sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate))
        .slice(indexOfFirstItem, indexOfLastItem);

    const totalFilteredReservations = reservations
        .filter(reservation => reservation.Status === 'Reserved')
        .filter(reservation => {
            const reservationMonth = new Date(reservation.StartDate).getMonth();
            return selectedMonths.length === 0 || selectedMonths.includes(Object.keys(monthsMap)[reservationMonth]);
        });

    const totalPages = Math.ceil(totalFilteredReservations.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // ========================== TABLE CODES END HERE ==========================

    // ========================== SEARCH CODES START HERE ==========================

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const searchIndex = reservations.findIndex(reservation => 
            reservation.Fullname.toLowerCase().includes(query) ||
            reservation.Email.toLowerCase().includes(query) ||
            reservation.MobileNo.toLowerCase().includes(query)
        );

        const page = Math.ceil((searchIndex + 1) / itemsPerPage);
        setCurrentPage(page);

        setCurrentPage(page);
    };

    // ========================== SEARCH CODES END HERE ==========================

    return (
        <>
            <div className='container'>
                <div className="d-flex align-items-end flex-row-reverse gap-2 mb-3 ">
                    <div className='col-9 col-lg-5 d-flex flex-row gap-2'>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search" 
                                aria-label="Search" 
                                aria-describedby="button-addon2"
                                value={searchQuery}
                                onChange={handleSearchChange} 
                            />
                            <button className="btn btn-primary" type="button" id="button-addon2" >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        <button className="btn btn-primary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Filter</button>

                        <ul className="dropdown-menu">
                            <h6 className='text-center mt-1'>Months <br/> <hr/></h6>
                            <div className='row me-2'>
                                <div className='col'>
                                    {Object.keys(monthsMap).slice(0, 6).map(month => (
                                        <div className="form-check ms-2" key={month}>
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                value={month} 
                                                id={`${month}Check`}
                                                onChange={() => handleMonthChange(month)}
                                            />
                                            <label className="form-check-label" htmlFor={`${month}Check`}>{month}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className='col'>
                                    {Object.keys(monthsMap).slice(6).map(month => (
                                        <div className="form-check ms-2" key={month}>
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                value={month} 
                                                id={`${month}Check`}
                                                onChange={() => handleMonthChange(month)}
                                            />
                                            <label className="form-check-label" htmlFor={`${month}Check`}>{month}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>

                <table className="table table-hover">
                    <thead className='table-primary'>
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
                    <tbody className='table-group-divider border-bottom border-dark'>
                        {currentReservations.length > 0 ? (
                            currentReservations.map(showReservation => (
                                <tr key={showReservation.ReservationId} className={searchQuery && showReservation.Fullname.toLowerCase().includes(searchQuery.toLowerCase()) ? 'table-warning' : ''}>
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
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => getReservationId(showReservation.ReservationId)}
                                                data-bs-toggle="tooltip"
                                                title="Complete"
                                            >
                                                <i className="bi bi-check-circle"></i>
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
                        {Array.from({ length: itemsPerPage - currentReservations.length }, (_, index) => (
                            <tr key={`empty-${index}`}>
                                <td colSpan="7" className='text-center'>No reservations available</td>
                            </tr>
                        ))}
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
