// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'main.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class NotificationMessageAdapter extends TypeAdapter<NotificationMessage> {
  @override
  final int typeId = 0;

  @override
  NotificationMessage read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return NotificationMessage()
      ..from = fields[0] as String?
      ..messageId = fields[1] as String?
      ..senderId = fields[2] as String?
      ..sendTime = fields[3] as DateTime?
      ..notificationTitle = fields[4] as String?
      ..notificationBody = fields[5] as String?;
  }

  @override
  void write(BinaryWriter writer, NotificationMessage obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.from)
      ..writeByte(1)
      ..write(obj.messageId)
      ..writeByte(2)
      ..write(obj.senderId)
      ..writeByte(3)
      ..write(obj.sendTime)
      ..writeByte(4)
      ..write(obj.notificationTitle)
      ..writeByte(5)
      ..write(obj.notificationBody);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NotificationMessageAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
