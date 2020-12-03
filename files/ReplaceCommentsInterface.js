/** NOTE: amended copy of -> comments/javascript/CommentsInterface.js
 * @package comments
 */
(function ($) {
	$(document).ready(function () {
		$('.comments-holder-container form').each(function (i, elem) {
			$(this).validate({
				ignore: ':hidden',
				errorClass: "required",
				errorElement: "span",
				invalidHandler: function (form, validator) {
					$('html, body').animate({
						scrollTop: $(validator.errorList[0].element).offset().top - 30
					}, 200);
				},

				/**
				 * Ensure any new error message has the correct class and placement
				 */
				errorPlacement: function (error, element) {
					error
						.addClass('message')
						.insertAfter(element);
				}
			});
		});

		/**
		 * Comment reply form
		 */
		$( ".comment-replies-container .comment-reply-form-holder" ).each(function(i, elem) {
				// If and only if this is not the currently selected form, hide it on page load
				var selectedHash = window.document.location.hash.substr(1),
					form = $(this).children('.reply-form');
				if( !selectedHash || selectedHash !== form.prop( 'id' ) ) {
					this.hide();
				}
		});

		/**
        * Toggle on/off reply form
        */
		$(".comment-reply-link").on('click', function(e) {
			var allForms = $( ".comment-reply-form-holder" ),
				// formID = $( this ).prop('href').replace(/^[^#]*#/, '#'),
				formID = '#' + $( this ).attr('aria-controls');
				form = $(formID).closest('.comment-reply-form-holder');
				
				$(this).attr('aria-expanded', function (i, attr) {
						return attr == 'true' ? 'false' : 'true'
				});

			// Prevent focus
			e.preventDefault();

			if (form.is(':visible')) {
				allForms.slideUp();
			} else {
				allForms.not(form).slideUp();
				form.slideDown();
			}
		});
		
		$('.comments-holder .comments-list').on('click', 'div.comment-moderation-options a', function(e) {
			var link = $(this);
            if (link.hasClass('delete')) {
                var confirmationMsg = ss.i18n._t('CommentsInterface_singlecomment_ss.DELETE_CONFIRMATION');
                var confirmation = window.confirm(confirmationMsg);
                if (!confirmation) {
                    e.preventDefault();
                    return false;
                }
            }
			var comment = link.parents('.comment:first');

			$.ajax({
				url: $(this).attr('href'),
				cache: false,
				success: function(html){
					if(link.hasClass('ham')) {
						// comment has been marked as not spam
						comment.html(html);
						comment.removeClass('spam');
					}
					else if(link.hasClass('approve')) {
						// comment has been approved
						comment.html(html);
						comment.removeClass('unmoderated');
					}
					else if(link.hasClass('delete')) {
						comment.fadeOut(1000, function() {
                            comment.remove();

							if(commentsList.children().length === 0) {
								noCommentsYet.show();
							}
						});
					}
					else if(link.hasClass('spam')) {
						comment.html(html).addClass('spam');
					}
				},
				failure: function(html) {
					var errorMsg = ss.i18n._t('CommentsInterface_singlecomment_ss.AJAX_ERROR');
                    alert(errorMsg);
				}
			});

			e.preventDefault();
		});
	});
})(jQuery);


