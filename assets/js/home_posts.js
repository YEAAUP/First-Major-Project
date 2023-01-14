{
    // method to submit the form data for new post using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-lists-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    console.log(data);
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        });

    }

    let newPostDom = function(post){
        return $(`
        <li id="post-${post._id} ">
        <p>
            <small>
                <a class="delete-post-button " href="/posts/destroy/${post._id}">Delete Post</a>
            </small>
            
            ${post.content}
            <small>
            ${post.user.name}
            </small>
            </p>
        </li>
   
    <div class="post-comments">
        
            <form action="/comments/create" method="post">
                <input type="text" name="content" placeholder="Type Here to Add Comment" required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Commnet">
            </form>

    
        <div class="post-comments-list">
            <ul id="post-comments-${post._id} ">
                
                
            </ul>
        </div>
    </div>`)
    }


    // method to delete a post from dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                }, error: function(error){
                    console.log(error, responseText);
                }
            })
        })
    }



    createPost();
}