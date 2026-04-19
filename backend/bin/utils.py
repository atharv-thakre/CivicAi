def to_dict(obj):
    return {
        column.name: getattr(obj, column.name)
        for column in obj.__table__.columns
    }