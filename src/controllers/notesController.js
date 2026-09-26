export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search,
    } = req.query

    const pageNumber = Number(page)
    const perPageNumber = Number(perPage)

    const myQuery = Note.find({
      userId: req.user._id,
    })

    if (tag) {
      myQuery.where({ tag })
    }

    if (search) {
      myQuery.where({
        $or: [
          {
            title: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            content: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      })
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(myQuery.getFilter()),
      myQuery
        .skip((pageNumber - 1) * perPageNumber)
        .limit(perPageNumber)
        .exec(),
    ])

    const totalPages = Math.ceil(totalNotes / perPageNumber)

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    })
  } catch (error) {
    next(error)
  }
}