document.addEventListener("DOMContentLoaded", () => {
  initFilterButton()
  getDogs()
})

function initFilterButton() {
  let filterBtn = document.getElementById("good-dog-filter")
  filterBtn.value = "false"

  filterBtn.addEventListener("click", () => {
    if (filterBtn.value === "false") {
      filterBtn.value = "true"
      filterBtn.innerHTML = "Filter good dogs: ON"
    } else {
      filterBtn.value = "false"
      filterBtn.innerHTML = "Filter good dogs: OFF"
    }
    getDogs()
  })
}

function getDogs() {
  fetch("http://localhost:3000/pups")
    .then(r => r.json())
    .then(dogs => filterDogs(dogs))
}

function filterDogs(dogs) {
  let filterBtn = document.getElementById("good-dog-filter")
  let filteredDogs = []

  if (filterBtn.value === "true") {
    filteredDogs = dogs.filter(dog => dog.isGoodDog)
  } else {
    filteredDogs = dogs
  }

  addDogsToDogBar(filteredDogs)
}

function addDogsToDogBar(dogs) {
  let dogBarDiv = document.getElementById("dog-bar")
  dogBarDiv.innerHTML = ""

  dogs.forEach(dog => {
    let span = document.createElement("span")
    span.innerHTML = dog.name
    span.id = dog.id
    span.addEventListener("click", event => {
      const dogId = event.target.id
      getDog(dogId)
    })

    dogBarDiv.appendChild(span)
  })
}

function getDog(dogId) {
  fetch(`http://localhost:3000/pups/${dogId}`)
    .then(r => r.json())
    .then(dog => showDogInfo(dog))
}

function showDogInfo(dog) {
  let dogInfoDiv = document.getElementById("dog-info")

  let img = document.createElement("img")
  img.src = dog.image

  let header = document.createElement("h2")
  header.innerHTML = dog.name

  let goodDogBtn = document.createElement("button")
  goodDogBtn.id = "good-dog"
  goodDogBtn.innerHTML = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
  goodDogBtn.addEventListener("click", () => toggleGoodDog(dog))

  dogInfoDiv.innerHTML = ""
  dogInfoDiv.append(img, header, goodDogBtn)
}

function toggleGoodDog(dog) {
  dog.isGoodDog = !dog.isGoodDog
  updateDog(dog)
}

function updateDog(dog) {
  fetch(`http://localhost:3000/pups/${dog.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: dog.isGoodDog,
    }),
  })
    .then(r => r.json())
    .then(updatedDog => updateGoodDogBtn(updatedDog))
}

function updateGoodDogBtn(updatedDog) {
  let goodDogBtn = document.getElementById("good-dog")
  goodDogBtn.innerHTML = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"
}
