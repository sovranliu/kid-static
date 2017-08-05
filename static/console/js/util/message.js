define(['jquery'], function ($) {

    function _message(message, type, $elem) {

        var time = 2000,
            fadeTime = 500;

        var $messageNode = $elem || $('.alert-message'),
            $messageText = $messageNode.find('span'),
            $closeBtn = $messageNode.find('.close');

        message = $.trim(message);

        $closeBtn.on('click', function() {
            $messageNode.addClass('hide');
        });

        $messageText.text(message);

        $messageNode.fadeIn(fadeTime, function() {
            $messageNode.addClass('alert-' + type).removeClass('hide');
            window.setTimeout(function () {
                $messageNode.fadeOut(fadeTime, function() {
                    $messageNode.addClass('hide').removeClass('alert-' + type);
                });
            }, time);
        });
    }

    return {
        message: _message,
        error: function (message, $elem) {
            this.message(message, 'danger', $elem);
        },
        success: function (message, $elem) {
            this.message(message, 'success', $elem);
        },
        info: function (message, $elem) {
            this.message(message, 'info', $elem);
        },
        warn: function (message, $elem) {
            this.message(message, 'warning', $elem);
        }
    };
});