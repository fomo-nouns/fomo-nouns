// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notifications_state.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DbNotificationsStateAdapter extends TypeAdapter<DbNotificationsState> {
  @override
  final int typeId = 1;

  @override
  DbNotificationsState read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DbNotificationsState(
      onAuctionEnd: fields[0] as bool,
      fiveMinBeforeEnd: fields[1] as bool,
      tenMinBeforeEnd: fields[2] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, DbNotificationsState obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.onAuctionEnd)
      ..writeByte(1)
      ..write(obj.fiveMinBeforeEnd)
      ..writeByte(2)
      ..write(obj.tenMinBeforeEnd);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DbNotificationsStateAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
