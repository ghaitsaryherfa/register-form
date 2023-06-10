// Variable that store all submitted form data
const formDatas = [];
const VACANCY_QUOTA = {
    'DATABASE DEVELOPER': 2,
    'BACKEND PROGRAMMER': 5,
    'FRONTEND PROGRAMMER': 4,
    'FULLSTACK PROGRAMMER': 2
};

// execute script when doc ready
$(document).ready(function () {
    // fill input select option based on values defined here
    const vacancy = Object.keys(VACANCY_QUOTA);
    const position = ['BANDUNG', 'JAKARTA'];

    fillSelect(vacancy, 'lowongan');
    fillSelect(position, 'posisi');
});

// Function that is going to change the select options
function fillSelect(values, id) {
    document.getElementById(id).innerHTML =
        values.reduce((tmp, x) => `${tmp}<option value='${x}' id='option-${x.replace(' ', '-').toLowerCase()}'>${x}</option>`, '');
}

// check vacancy registered
function checkVacancyQuota(vacancy) {
    let applied = 0;
    let status = 'available';
    let availability = VACANCY_QUOTA[vacancy];
    for (const data of formDatas) {
        if (data.vacancy === vacancy) {
            applied++;
        }
    }
    availability -= applied;

    if (availability > 0 && availability <= 2) {
        status = 'low';
    } else if (availability === 0) {
        status = 'unavailable';
    }

    return {
        status,
        applied,
        availability
    };
}

// reset form value to default
function resetForm() {
    $('#fullname').val('');
    $('#email').val('');
    $('#telepon').val('');
    $('#lowongan').val('DATABASE DEVELOPER');
    $('#posisi').val('BANDUNG');
}

// function that triggered when form submitted
function submitForm(e) {
    e.preventDefault();

    // get form data
    const data = {
        fullname: $('#fullname').val(),
        email: $('#email').val(),
        phone: $('#telepon').val(),
        vacancy: $('#lowongan').val(),
        position: $('#posisi').val(),
    };

    // required validation
    if (!data.fullname || !data.email || !data.phone || !data.vacancy || !data.position) {
        alert('Form wajib diisi');
        return;
    }

    // email validation
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,10}$/;
    if (!emailPattern.test(data.email)) {
        alert('Email tidak valid');
        return;
    }

    // email exist validation
    const emailExist = formDatas.find((d) => d.email === data.email);
    if (emailExist) {
        alert('Email sudah terdaftar!');
        return;
    }

    // vacancy availability validation
    const vacancyAvailability = checkVacancyQuota(data.vacancy);
    let vacancyStatusMessage = '';
    if (vacancyAvailability.status === 'available') {
        vacancyStatusMessage = `Anda dapat memilih lowongan ${data.vacancy}`;
    } else if (vacancyAvailability.status === 'low') {
        vacancyStatusMessage = `Kuota tersisa untuk ${data.vacancy} hanya ${vacancyAvailability.availability} pendaftar`;
    } else if (vacancyAvailability.status === 'unavailable') {
        vacancyStatusMessage = `Mohon maaf, rekrutasi untuk ${data.vacancy} sudah penuh dan tidak dapat dipilih`;
        alert(vacancyStatusMessage);
        return;
    }

    // save data
    formDatas.push(data);

    // show info
    alert('Sukses menyimpan data');
    alert(`
    Total Pendaftar: ${formDatas.length}    
    ${vacancyStatusMessage}

    Data tersimpan
        Fullname : ${data.fullname}
        Email : ${data.email}
        Telepon : ${data.phone}
        Lowongan : ${data.vacancy}
        Posisi : ${data.position}
        `);

    // reset form
    resetForm();
}
