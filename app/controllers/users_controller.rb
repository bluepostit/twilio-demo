class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    setup_video_call_token
  end

  private

  def setup_video_call_token
    # No chatting with yourself
    return if @user == current_user

    twilio = TwilioService.new
    @video_call_token = twilio.generate_token(current_user, @user)
  end
end
