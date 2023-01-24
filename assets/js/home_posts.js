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
                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
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
            <br>
                        <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            
                        </small>

            </p>
        </li>
   
    <div class="post-comments">
        
            <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
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


    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}