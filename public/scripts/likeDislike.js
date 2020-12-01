window.onload= function() {
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')

    likeBtn.addEventListener('click', function(e){
        let postId = likeBtn.dataset.post 
        reqLikeDislike('likes',postId)
              .then(res => res.json())
              .then(data =>{
                  let likeText = data.liked ? 'Liked' : 'Like'
                  likeText = likeText + `( ${data.totallikes} )`
                  let dislikeText = `Dislike ( ${data.totaldislikes} )`

                  likeBtn.innerHTML = likeText
                  dislikeBtn.innerHTML = dislikeText

              })
              .catch(e =>{
                  console.log(e)
                  alert(e.response.data.error)

              })
    })

    dislikeBtn.addEventListener('click', function(e){
        let postId = likeBtn.dataset.post 
        reqLikeDislike('dislikes',postId)
              .then(res => res.json())
              .then(data =>{
                  let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                  dislikeText = dislikeText + `( ${data.totaldislikes} )`
                  let likeText = `like ( ${data.totallikes} )`

                  likeBtn.innerHTML = likeText
                  dislikeBtn.innerHTML = dislikeText

              })
              .catch(e =>{
                  console.log(e)
                  alert(e.response.data.error)

              })
    })


    function reqLikeDislike (type, postId) {
        let headers = new Headers()

        headers.append('Accetp', 'Application/JSON')
        headers.append('Content-Type', 'Application')

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }
}