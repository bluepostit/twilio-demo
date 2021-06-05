require 'twilio-ruby'

class TwilioService
  # Generate a token for user1 to chat to user2
  def generate_token(user1, user2)
    # Required for any Twilio Access Token
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    # To create an API key & secret for your app, go to
    #  https://www.twilio.com/console/project/api-keys
    api_key = ENV['TWILIO_API_KEY']
    api_secret = ENV['TWILIO_API_SECRET']

    # Identify user1
    identity = "user-#{user1.id}"
    # Identify the video room
    room = unique_room_id(user1, user2)

    # Create a Twilio access token
    # See https://www.twilio.com/docs/video/tutorials/user-identity-access-tokens#generating-access-tokens
    token = Twilio::JWT::AccessToken.new(
      account_sid,
      api_key,
      api_secret,
      [],
      identity: identity
    )

    # Create video grant for the token
    grant = Twilio::JWT::AccessToken::VideoGrant.new
    grant.room = room

    token.add_grant(grant)

    # Generate JWT from token
    jwt = token.to_jwt

    {
      token: jwt,
      room: room
    }
  end

  def unique_room_id(user1, user2)
    id = [user1, user2].map(&:id).sort.join('-')
    "room-#{id}"
  end
end
