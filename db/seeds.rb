User.destroy_all

# Create two users

User.create!(email: 'bob@bob.com', password: '123456', name: 'Bob')
User.create!(email: 'sue@sue.com', password: '123456', name: 'Sue')
