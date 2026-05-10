from app.database.models import Audit, Mainchain, Officer
from app.database.db import SessionLocal

#======================AUDIT======================

def create_audit(user_id, commit_id):
    db = SessionLocal()
    audit = Audit(
        user_id=user_id,
        commit_id=commit_id
    )

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit

def get_audits(user_id):
    db = SessionLocal()
    return (
    db.query(Audit)
        .filter(Audit.user_id == user_id)
        .order_by(Audit.created_at.desc())
        .all()
    )

def get_all_audits():
    db = SessionLocal()
    return (
        db.query(Audit)
        .order_by(Audit.created_at.desc())
        .all()
    )

#======================MAINCHAIN======================

def create_mainchain_record(record_id, hash_token, commit_id, wallet):
    db = SessionLocal()
    record = Mainchain(
        record_id=record_id,
        hash_token=hash_token,
        commit_id=commit_id,
        wallet=wallet
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record

def get_mainchain_records(user_id):
    db = SessionLocal()
    return (
    db.query(Mainchain)
        .join(Officer, Mainchain.wallet == Officer.wallet)
        .filter(Officer.user_id == user_id)
        .order_by(Mainchain.created_at.desc())
        .all()
    )

def get_all_mainchain_records():
    db = SessionLocal()
    return (
        db.query(Mainchain)
        .order_by(Mainchain.created_at.desc())
        .all()
    )