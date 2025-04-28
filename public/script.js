import { mlaData } from './mlaData.js';

const startButton = document.getElementById('startButton');
const formContainer = document.getElementById('formContainer');
const roleSelect = document.getElementById('roleSelect');
const districtSelect = document.getElementById('districtSelect');
const constituencySelect = document.getElementById('constituencySelect');
const personDetailsDiv = document.getElementById('personDetails');
const feedbackBox = document.getElementById('feedbackBox');
const feedbackLabel = document.getElementById('feedbackLabel');
const ratingStarsDiv = document.getElementById('ratingStars');
const ratingLabel = document.getElementById('ratingLabel');
const submitBtn = document.getElementById('submitBtn');
const districtLabel = document.getElementById('districtLabel');
const constituencyLabel = document.getElementById('constituencyLabel');
const form = document.getElementById('feedbackForm');

let currentRating = 0;

function uniqueValues(data, key) {
  return [...new Set(data.map(item => item[key]))];
}

function populateDistricts(role) {
  districtSelect.innerHTML = '<option value="" disabled selected>Select district</option>';
  constituencySelect.innerHTML = '<option value="" disabled selected>Select constituency</option>';
  personDetailsDiv.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  feedbackLabel.classList.add('hidden');
  ratingStarsDiv.classList.add('hidden');
  ratingLabel.classList.add('hidden');
  submitBtn.classList.add('hidden');

  if (!role) {
    districtSelect.classList.add('hidden');
    districtLabel.classList.add('hidden');
    constituencySelect.classList.add('hidden');
    constituencyLabel.classList.add('hidden');
    return;
  }

  districtSelect.classList.remove('hidden');
  districtLabel.classList.remove('hidden');
  constituencySelect.classList.add('hidden');
  constituencyLabel.classList.add('hidden');

  let data = role === 'MLA' ? mlaData : mpData;
  let districts = uniqueValues(data, 'District');
  districts.forEach(district => {
    const option = document.createElement('option');
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });
}

function populateConstituencies(role, district) {
  constituencySelect.innerHTML = '<option value="" disabled selected>Select constituency</option>';
  personDetailsDiv.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  feedbackLabel.classList.add('hidden');
  ratingStarsDiv.classList.add('hidden');
  ratingLabel.classList.add('hidden');
  submitBtn.classList.add('hidden');

  if (!district) {
    constituencySelect.classList.add('hidden');
    constituencyLabel.classList.add('hidden');
    return;
  }

  constituencySelect.classList.remove('hidden');
  constituencyLabel.classList.remove('hidden');

  let data = role === 'MLA' ? mlaData : mpData;
  let constituencies = data.filter(item => item.District === district).map(item => item.Constituency);
  constituencies = [...new Set(constituencies)];
  constituencies.forEach(constituency => {
    const option = document.createElement('option');
    option.value = constituency;
    option.textContent = constituency;
    constituencySelect.appendChild(option);
  });
}

function showPersonDetails(role, district, constituency) {
  console.log('showPersonDetails called with:', role, district, constituency);
  if (!district || !constituency) {
    console.log('Hiding details because district or constituency is missing');
    personDetailsDiv.classList.add('hidden');
    feedbackBox.classList.add('hidden');
    feedbackLabel.classList.add('hidden');
    ratingStarsDiv.classList.add('hidden');
    ratingLabel.classList.add('hidden');
    submitBtn.classList.add('hidden');
    return;
  }

  let data = role === 'MLA' ? mlaData : mpData;
  let person = data.find(item => item.District === district && item.Constituency === constituency);

  if (!person) {
    console.log('Hiding details because person not found');
    personDetailsDiv.classList.add('hidden');
    feedbackBox.classList.add('hidden');
    feedbackLabel.classList.add('hidden');
    ratingStarsDiv.classList.add('hidden');
    ratingLabel.classList.add('hidden');
    submitBtn.classList.add('hidden');
    return;
  }

  personDetailsDiv.innerHTML = `
    <strong>Name:</strong> ${person.Name}<br/>
    <strong>Party:</strong> ${person.Party || 'N/A'}
  `;
  personDetailsDiv.classList.remove('hidden');
  feedbackBox.classList.remove('hidden');
  feedbackLabel.classList.remove('hidden');
  ratingStarsDiv.classList.remove('hidden');
  ratingLabel.classList.remove('hidden');
  submitBtn.classList.remove('hidden');
}

function resetStars() {
  const stars = ratingStarsDiv.querySelectorAll('.star');
  stars.forEach(star => {
    star.classList.remove('selected');
  });
  currentRating = 0;
}

function setRating(rating) {
  currentRating = rating;
  const stars = ratingStarsDiv.querySelectorAll('.star');
  stars.forEach(star => {
    star.classList.remove('animate-pop');
  });
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= rating) {
      star.classList.remove('selected');
      star.classList.remove('animate-pop');
    } else {
      star.classList.add('selected');
    }
  });
}

ratingStarsDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('star')) {
    const selectedRating = parseInt(e.target.dataset.value);
    if (currentRating === selectedRating) {
      setRating(0);
    } else {
      setRating(selectedRating);
    }
  }
});

startButton.addEventListener('click', (e) => {
  e.preventDefault();
  startButton.classList.add('hidden');
  formContainer.classList.remove('hidden');
  const description = document.querySelector('.description');
  if (description) {
    description.textContent = "This website is created for people to reach out to their MLAs. This is a feedback portal that will help people write their cases to their respective political leaders to tell what is happening or any other issues. This might help leaders to connect with and support the people better.";
    description.classList.add('animated-description');
  }
});

roleSelect.addEventListener('change', () => {
  const role = roleSelect.value;
  populateDistricts(role);
  constituencySelect.classList.add('hidden');
  constituencyLabel.classList.add('hidden');
  personDetailsDiv.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  feedbackLabel.classList.add('hidden');
  ratingStarsDiv.classList.add('hidden');
  ratingLabel.classList.add('hidden');
  submitBtn.classList.add('hidden');
  resetStars();
});

districtSelect.addEventListener('change', () => {
  const role = roleSelect.value;
  const district = districtSelect.value;
  populateConstituencies(role, district);
  personDetailsDiv.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  feedbackLabel.classList.add('hidden');
  ratingStarsDiv.classList.add('hidden');
  ratingLabel.classList.add('hidden');
  submitBtn.classList.add('hidden');
  resetStars();
});

constituencySelect.addEventListener('change', () => {
  const role = roleSelect.value;
  const district = districtSelect.value;
  const constituency = constituencySelect.value;
  showPersonDetails(role, district, constituency);
  resetStars();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const role = roleSelect.value;
  const district = districtSelect.value;
  const constituency = constituencySelect.value;
  const feedback = feedbackBox.value.trim();

  if (!role || !district || !constituency || !feedback || currentRating === 0) {
    alert('Please fill in all fields and provide a rating.');
    return;
  }

  let data = role === 'MLA' ? mlaData : [];
  let person = data.find(item => item.District === district && item.Constituency === constituency);

  const feedbackData = {
    role,
    district,
    constituency,
    name: person ? person.Name : 'N/A',
    party: person ? person.Party : 'N/A',
    rating: currentRating,
    feedback
  };

  try {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedbackData)
    });

    if (response.ok) {
      alert('Feedback submitted successfully.');
      form.reset();
      districtSelect.classList.add('hidden');
      districtLabel.classList.add('hidden');
      constituencySelect.classList.add('hidden');
      constituencyLabel.classList.add('hidden');
      personDetailsDiv.classList.add('hidden');
      feedbackBox.classList.add('hidden');
      feedbackLabel.classList.add('hidden');
      ratingStarsDiv.classList.add('hidden');
      ratingLabel.classList.add('hidden');
      submitBtn.classList.add('hidden');
      resetStars();
    } else {
      alert('Failed to submit feedback.');
    }
  } catch (error) {
    alert('Error submitting feedback: ' + error.message);
  }
});
