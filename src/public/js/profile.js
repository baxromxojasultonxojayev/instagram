let photoElement = document.querySelector("#profile_photo")

photoElement.addEventListener('change', async (event)=>{
  if(event.target.files.length){
    let formdata = new FormData()
    formdata.append('photo', event.target.files[0])
    let response = await fetch('profile/photo', {
      method: "POST",
      body: formdata
    })
    response = await response.json()
    console.log(response);
    if(response.ok){
      window.location.reload()
    }else {
      alert("Error")
    }
  }
})