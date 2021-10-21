const { AuthenticationError } = require('apollo-server');
const Note = require('../../models/Note');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getNotes() {
            try {
                const notes = await Note.find().sort({ createdAt: -1 });
                return notes
            } catch(err){
                throw new Error(err);
            }
        },
        async getNote(_, { noteId }) {
            try {
                const note = await Note.findById(noteId);
                if(note) {
                    return note
                } else {
                    throw new Error('Note not found');
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createNote(_, { body }, context) {
            const user = checkAuth(context);
            console.log(user)
            const newNote = new Note({
                body,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const note = await newNote.save();

            return note;
        },
        async deleteNote(_, { noteId }, context) {
            const user = checkAuth(context);
      
            try {
              const note = await Note.findById(noteId);
              if (user.username === note.username) {
                await note.delete();
                return 'Note deleted successfully';
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } catch (err) {
              throw new Error(err);
            }
          },
    }
}