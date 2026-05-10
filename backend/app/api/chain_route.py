from fastapi import APIRouter
from blockchain.remote import get_records_by_commit , get_commit_diff 
from app.database.audit import get_mainchain_records , create_mainchain_record , get_audits, get_all_audits , get_all_mainchain_records
from blockchain.chain import verify_chain
from bin.utils import save_json , to_dict_list , to_dict
from app.schemas.set_04 import CreateMainchainRecord


router = APIRouter(prefix="/chain", tags=["chain"])

@router.get("/verify")
def verify_records_route():
    status = verify_chain()
    return {"status": status}

@router.get("/records/{commit_sha}")
def get_records_by_commit(commit_sha: str):
    records = get_records_by_commit(commit_sha)
    if records:
        return records
    return {"error": "Records not found"}


@router.get("/diff/{commit_sha}")
def get_commit_diff(commit_sha: str):
    diff = get_commit_diff(commit_sha)
    if diff:
        return {"diff": diff}
    return {"error": 'Invaild commit_sha'}


@router.get("/audits/{user_id}")
def get_audits_route(user_id: int):
    audits = get_audits(user_id)
    return to_dict_list(audits)

@router.get("/audits")
def get_all_audits_route():
    audits = get_all_audits()
    return to_dict_list(audits)


#mainchain routes


@router.post("/mainnet/create")
def create_mainchain_record_route(data : CreateMainchainRecord):
    record = create_mainchain_record(record_id=data.record_id, hash_token=data.hash_token, commit_id=data.commit_id, wallet=data.wallet)
    return to_dict(record)

@router.get("/mainnet/{user_id}")
def get_mainchain_records_route(user_id: int):
    records = get_mainchain_records(user_id)
    return to_dict_list(records)

@router.get("/mainnet")
def get_all_mainchain_records_route():
    records = get_all_mainchain_records()
    return to_dict_list(records)


